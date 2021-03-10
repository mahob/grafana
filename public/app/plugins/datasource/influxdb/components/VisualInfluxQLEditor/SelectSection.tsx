import React, { FC } from 'react';
// import { SegmentAsync } from '@grafana/ui';
// import { SelectableValue } from '@grafana/data';
import { InfluxQueryPart } from '../../types';

type Props = {
  parts: InfluxQueryPart[][] | undefined;
};

export const SelectSection: FC<Props> = ({ parts }) => {
  return <div>Select {JSON.stringify(parts)}</div>;
};
