import React from "react";

export interface IData {
  additionalSources: {
    additionalSources: any[];
    __typename: string;
  };
  campaignSettings: {
    campaignSettings: any[];
    __typename: string;
  };
  feedExports: {
    feedExports: any[];
    __typename: string;
  };
  variables: {
    variables: any[];
    __typename: string;
  }
}

export interface IServerData {
  data: IData
}

export interface IInitialNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    originalId?: string;
    placeholderName?: string;
  };
  style: React.CSSProperties;
  type?: 'input' | 'output';
  sourcePosition?: any;
  targetPosition?: any;
}

export interface IInitialEdges {
  id: string;
  source: string;
  target: string;
}

export interface IKeyword {
  id: number;
  name: string;
  target: string;
  getConditionsPlaceholders: string[];
  getPlaceholdersWithoutConditions: string[];
  __typename: string;
}