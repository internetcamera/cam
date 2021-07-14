import { Film } from '@internetcamera/sdk/dist/types';
import { formatEther } from 'ethers/lib/utils';
import React from 'react';
import { ProgressChart } from 'react-native-chart-kit';

const FilmProgressIcon = ({ film }: { film: Film }) => {
  return (
    <ProgressChart
      data={{
        data: [parseInt(film.used) / parseInt(formatEther(film.totalSupply))]
      }}
      width={22}
      height={22}
      strokeWidth={2}
      radius={8}
      chartConfig={{
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        backgroundColor: 'none',
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0
      }}
      hideLegend
    />
  );
};

export default FilmProgressIcon;
