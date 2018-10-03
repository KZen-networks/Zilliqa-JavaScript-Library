import {Emitter} from 'mitt';
import {AxiosPromise} from 'axios';

export type Subscriber = (event: any) => void;
export type Subscribers = Map<SubscriptionToken, Subscriber>;
type SubscriptionToken = symbol;

export interface Provider {
  broadcaster: Emitter;
  subscribers: Subscribers;
  // TODO: strict typing when we have a better idea of how to generalise the
  // payloads sent to lookup nodes - protobuf?
  send(method: string, ...params: any[]): Promise<RPCResponse>;
  subscribe(event: string, subscriber: Subscriber): Symbol;
  unsubscribe(token: Symbol): void;
}

export abstract class Signer {
  abstract sign(payload: Signable): Signable;
}

export interface Signable {
  bytes: Buffer;
}

interface RPCBase {
  id: 1;
  jsonrpc: '2.0';
}

export interface RPCRequest extends RPCBase {
  method: string;
  params: any[];
}

export interface RPCResponse extends RPCBase {
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * ZilliqaModule
 *
 * This interface must be implemented by all top-level modules.
 */
export interface ZilliqaModule {
  provider: Provider;
  signer: Signer;
}
