import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';

export interface ISpfxProps {
  description: string;
  items: any[];
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onAddItem: (item: any) => void;
  context: WebPartContext;
}
