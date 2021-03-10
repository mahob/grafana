import React, { FC } from 'react';
import { InfluxQuery, InfluxQueryTag } from '../../types';
import InfluxDatasource from '../../datasource';
import { FromSection } from './FromSection';
import { TagsSection } from './TagsSection';
import { SelectSection } from './SelectSection';
import {
  getAllMeasurements,
  getAllPolicies,
  getTagKeysForMeasurement,
  getTagValues,
} from '../../influxQLMetadataQuery';

// notes about strange combinations:
// - if a tag has a strange `operator` (XOR), it just gets written into the query
//   - the UI will show it even
// - if a non-first tag has a missing `condition` it is assumed it is `AND`
// - if a tag has a missing `operator` it is assumed it is `=`

function unwrap<T>(value: T | null | undefined): T {
  if (value == null) {
    throw new Error('value must not be nullish');
  }
  return value;
}

type Props = {
  query: InfluxQuery;
  onChange: (query: InfluxQuery) => void;
  onRunQuery: () => void;
  datasource: InfluxDatasource;
};

export const Editor: FC<Props> = ({ query, onChange, onRunQuery, datasource }) => {
  const handleFromSectionChange = (policy: string | undefined, measurement: string | undefined) => {
    onChange({
      ...query,
      policy,
      measurement,
    });
  };

  const handleTagsSectionChange = (tags: InfluxQueryTag[]) => {
    // we set empty-arrays to undefined
    onChange({
      ...query,
      tags: tags.length === 0 ? undefined : tags,
    });
    onRunQuery();
  };

  // FIXME: missing:
  // - resultFormat
  // - orderByTime
  // - groupBy
  // - limit
  // - slimit
  // - tz
  // - fill
  // - alias
  return (
    <div>
      <FromSection
        policy={query.policy}
        measurement={query.measurement}
        getAllPolicies={() => getAllPolicies(datasource)}
        getAllMeasurements={() => getAllMeasurements(datasource)}
        onChange={handleFromSectionChange}
      />
      <TagsSection
        tags={query.tags ?? []}
        onChange={handleTagsSectionChange}
        getTagKeys={() => getTagKeysForMeasurement(unwrap(query.measurement), query.policy, datasource)}
        getTagValuesForKey={(key: string) => getTagValues(key, unwrap(query.measurement), query.policy, datasource)}
      />
      <SelectSection parts={query.select} />
    </div>
  );
};
