export interface IMessageProducerRepository {
  sendMessage(body: string);
}

export const IMessageProducerRepository = Symbol('IMessageProducerRepository');
