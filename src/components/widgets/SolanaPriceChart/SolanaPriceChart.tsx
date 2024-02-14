import { memo, useEffect, useState } from 'react';
import json from './SolanaPriceChart.json';
import Widget from '@/components/Widget/Widget';
import { WidgetWidth } from '@/lib/constants';
import { PubSubEvent, useSub } from '@/hooks/usePubSub';
import { hToPx } from '@/lib/appUtils';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';

type Props = {
  wid: string;
};

export default function SolanaPriceChart({ wid }: Props) {
  const [theme, setTheme] = useState(localStorage.getItem('nightwind-mode') ?? 'dark');
  useSub(PubSubEvent.ThemeChange, () => {
    setTheme(localStorage.getItem('nightwind-mode') ?? 'dark');
  });

  const [data, setData] = useState([]);

  const fetchData = async () => {
    const result = await axios(
      'https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=30',
    );
    console.log(result)

    setData(result.data.prices.map((item:any) => ({ date: new Date(item[0]).toLocaleDateString(), price: item[1] })));
  };

  useEffect(() => {
    fetchData();
  }, [])

  // memo: to avoid re-rendering (when moving widget)
  const Chart = memo(() => {
    return (
      <>
        <div id={wid + '-container'}></div>
        <div style={{margin:"auto"}}>
            <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis dataKey="price" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </div>
      </>
    );
  });

  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={json.info.w}
      h={json.info.h}
      cn="overflow-hidden"
      onSettings={({ settings }) => {
        // setCurrentSymbol(settings?.symbol ?? symbol); // default to symbol prop if no settings
      }}
      render={() => {
        return <Chart />;
      }}
    />
  );
}
