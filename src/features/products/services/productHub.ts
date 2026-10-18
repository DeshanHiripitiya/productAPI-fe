// src/ProductHub.ts

import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import type { Product } from '../types/product';

const PRODUCT_HUB_URL = 'https://localhost:7183/hubs/products';

export async function connectToProductHub(
  onCreated: (product: Product) => void,
  onUpdated: (product: Product) => void,
  onDeleted: (id: number) => void,
) {
  const connection = new HubConnectionBuilder()
    .withUrl(PRODUCT_HUB_URL)
    .withAutomaticReconnect()
    .build();

  connection.on('ProductCreated', onCreated);
  connection.on('ProductUpdated', onUpdated);
  connection.on('ProductDeleted', onDeleted);

  await connection.start();

  return async () => {
    connection.off('ProductCreated', onCreated);
    connection.off('ProductUpdated', onUpdated);
    connection.off('ProductDeleted', onDeleted);

    if (connection.state !== HubConnectionState.Disconnected) {
      await connection.stop();
    }
  };
}
