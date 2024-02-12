import { memo, useEffect, useState } from 'react';
import { SymbolOverview } from 'react-tradingview-embed';
import json from './OrderBook.json';
import Widget from '../../components/Widget/Widget';
import { WidgetWidth } from '../../utils/constants';
import { PubSubEvent, useSub } from '../../hooks/usePubSub';
import { hToPx } from '../../utils/appUtils';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { RiBillLine } from 'react-icons/ri';
import Popup from 'reactjs-popup';
import { Checkbox, Tooltip } from '@mui/material';
import axios from 'axios';

type Props = {
  wid: string;
};

export default function OrderBook({ wid }: Props) {
  const [theme, setTheme] = useState(localStorage.getItem('nightwind-mode') ?? 'dark');
  useSub(PubSubEvent.ThemeChange, () => {
    setTheme(localStorage.getItem('nightwind-mode') ?? 'dark');
  });


  const onMenuClick = (menuId: number, callback: Function) => {
    console.log(menuId)
  }
  // memo: to avoid re-rendering (when moving widget)
  const Orders = memo(() => {
    return (
      <>
        <div id={wid + '-container'}>

        </div>
        <div className='flex items-center m-2'>
          <RiBillLine size={30} color='rgb(51, 116, 217)' />
          <div className='form-control relative flex h-7'>
            <input type='text' className='text-md focus:ring-0 focus:ring-offset-0 border border-stroke-interactive focus:border focus:border-primary/70 focus:shadow-ring-soft outline-none focus:outline-none bg-neutral/10 focus:bg-neutral/20 hover:bg-base-03 rounded placeholder-neutral transition-all peer h-full disabled:opacity-50 disabled:border-stroke disabled:cursor-not-allowed w-full pl-6' placeholder="Search by name or token" />
            <FiSearch className='absolute left-0 top-0 min-w-7 h-full flex items-center justify-center transition-all text-fg-secondary peer-focus:text-primary p-1.5' color='#2e2e2e' />
          </div>
          <div>
            <Popup trigger={<button className='group transition-all aspect-square flex items-center justify-center rounded outline-none focus:outline-none hover:bg-neutral/30 focus:bg-neutral/50 text-gray-50 data-[open=true]:bg-primary/20 w-7 h-7' >
              <FiFilter color='#fff' />
            </button>} position="right center">
              {
                (close: any) => {
                  return <div style={{
                    background: "rgba(59,130,246,.5)",
                    borderRadius: "5px",
                    padding: "15px"
                  }}>
                    <ul>
                      <span className='font-bold'>TYPE</span>
                      <li onClick={() => onMenuClick(0, close)}><Checkbox />Swap</li>
                      <li onClick={() => onMenuClick(0, close)}><Checkbox />Snipe</li>
                      <li onClick={() => onMenuClick(0, close)}><Checkbox />Advanced</li>
                      <hr />
                      <span className='font-bold'>STATUS</span>
                      <li onClick={() => onMenuClick(0, close)}><Checkbox />Success</li>
                      <li onClick={() => onMenuClick(0, close)}><Checkbox />Error</li>
                      <li onClick={() => onMenuClick(0, close)}><Checkbox />Idle</li>
                    </ul>
                  </div>
                }
              }

            </Popup>
          </div>
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
        return <Orders />;
      }}
    />
  );
}
