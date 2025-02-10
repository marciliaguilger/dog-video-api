export interface IMessageProducerRepository {
  sendMessage(body: string);
  send(body: string);
}

export const IMessageProducerRepository = Symbol('IMessageProducerRepository');
