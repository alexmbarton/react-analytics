// @flow

import type { data, options } from './types';

// Accumlates count over a given period
export const accumulator = (data: data, period: number, options?: options) => {
  const input = data.slice();
  const output = [];
  let currentPeriod = 0;
  let attributeCount = 1;
  while (input.length >= period) {
    const rowArray = [];

    currentPeriod += period;

    // Take week
    const week = input.splice(0, period);

    // First day should be n minus period.
    rowArray.push(week[period - 7].date);

    // rd: reduced data
    let rd = week.reduce(
      (s, v) => {
        return {
          count: (s.count += v.count),
          denom: (s.denom += v.denom),
          attribute: (s.attribute += v.attribute ? v.attribute : '')
        };
      },
      {
        count: 0,
        denom: 0,
        attribute: ''
      }
    );

    if (options && options.percentage) {
      rd.count = rd.count / rd.denom;
    }

    rowArray.push(rd.count);

    if (options && options.goal) {
      const goalValue = options.percentage ? options.goal / 100 : options.goal;
      rowArray.push(goalValue);
    }

    // Handle attributes
    if (rd.attribute) {
      rowArray.push(attributeCount.toString());
      attributeCount++;
      rowArray.push(rd.attribute);
    } else {
      rowArray.push(null);
      rowArray.push(null);
    }

    output.push(rowArray);
  }

  return output;
};
