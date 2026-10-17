import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

export interface Product {
  id: number;
  name: string;
  price: number;
}

export async function connectToProductHub(
  onCreated: (product: Product) => void,
  onUpdated: (product: Product) => void,
  onDeleted: (id: number) => void,
) {
  const connection = new HubConnectionBuilder()
    .withUrl('https://localhost:7183/hubs/products')
    .withAutomaticReconnect()
    .build();

  connection.on('ProductCreated', onCreated);
  connection.on('ProductUpdated', onUpdated);
  connection.on('ProductDeleted', onDeleted);

  await connection.start();

  return async () => {
    if (connection.state !== HubConnectionState.Disconnected) {
      await connection.stop();
    }
  };
}
