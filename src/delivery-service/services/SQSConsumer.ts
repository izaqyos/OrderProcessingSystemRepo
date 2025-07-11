import { sqs, logger } from '../../shared';
import { OrderCreatedEvent } from '../../shared';
import { DeliveryService } from './DeliveryService';

export class SQSConsumer {
  private isRunning = false;
  private deliveryService: DeliveryService;
  private pollingInterval?: NodeJS.Timeout;

  constructor() {
    this.deliveryService = new DeliveryService();
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('SQS Consumer already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting SQS Consumer');

    // Start polling for messages
    this.pollingInterval = setInterval(async () => {
      await this.pollMessages();
    }, 5000); // Poll every 5 seconds

    // Initial poll
    await this.pollMessages();
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    logger.info('Stopping SQS Consumer');

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = undefined;
    }
  }

  private async pollMessages(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      const messages = await sqs.pollMessages('orders-queue.fifo', 10);
      
      if (messages.length === 0) {
        logger.debug('No messages received from SQS');
        return;
      }

      logger.info(`Processing ${messages.length} messages from SQS`);

      // Process messages sequentially to maintain order
      // Production would use parallel processing with careful ordering
      for (const message of messages) {
        try {
          await this.processMessage(message);
          
          // Delete message after successful processing
          await sqs.deleteMessage('orders-queue.fifo', message.receiptHandle);
          
          logger.debug('Message processed and deleted', { 
            messageId: message.messageId 
          });
        } catch (error) {
          logger.error('Failed to process message', { 
            messageId: message.messageId,
            error: error instanceof Error ? error.message : error 
          });
          
          // In production, would implement:
          // - Retry logic with exponential backoff
          // - Dead letter queue for failed messages
          // - Message visibility timeout management
        }
      }
    } catch (error) {
      logger.error('Error polling SQS messages', { 
        error: error instanceof Error ? error.message : error 
      });
    }
  }

  private async processMessage(message: any): Promise<void> {
    try {
      const event = message.body;
      
      if (!event.eventType) {
        logger.warn('Message missing eventType', { messageId: message.messageId });
        return;
      }

      logger.info('Processing event', { 
        eventType: event.eventType,
        messageId: message.messageId 
      });

      switch (event.eventType) {
        case 'ORDER_CREATED':
          await this.deliveryService.processOrderCreated(event as OrderCreatedEvent);
          break;
        
        default:
          logger.warn('Unknown event type', { 
            eventType: event.eventType,
            messageId: message.messageId 
          });
      }
    } catch (error) {
      logger.error('Error processing message', { 
        messageId: message.messageId,
        error: error instanceof Error ? error.message : error 
      });
      throw error;
    }
  }
} 