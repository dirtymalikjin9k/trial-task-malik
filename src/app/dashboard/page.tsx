"use client"
import AddWidgetModal from "@/components/base/AddWidgetModal/AddWidgetModal";
import { Button } from "@/components/ui/button";
import { isDoubleHeightWidget } from "@/components/widgets";
import AirQuality from "@/components/widgets/AirQuality/AirQuality";
import AnalogClock from "@/components/widgets/AnalogClock/AnalogClock";
import Clock from "@/components/widgets/AnalogClock/Clock";
import Embed from "@/components/widgets/Embed/Embed";
import LofiPlayer from "@/components/widgets/LofiPlayer/LofiPlayer";
import Note from "@/components/widgets/Note/Note";
import OrderBook from "@/components/widgets/OrderBook/OrderBook";
import Quote from "@/components/widgets/Quote/Quote";
import RSSReader from "@/components/widgets/RSSReader/RSSReader";
import SolanaPriceChart from "@/components/widgets/SolanaPriceChart/SolanaPriceChart";
import StockChart from "@/components/widgets/StockChart/StockChart";
import StockMini from "@/components/widgets/StockMini/StockMini";
import Toggl from "@/components/widgets/Toggl/Toggl";
import Weather from "@/components/widgets/Weather/Weather";
import { generateWID, getLS } from "@/lib/appUtils";
import { DefaultLayout, DefaultWidgets } from "@/lib/constants";
import { UserWidget, Widget } from "@/types";
import { auth } from "auth"
import { useEffect, useState } from "react";
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigation } from "@/hooks/useNavigation";
import { useSession } from "next-auth/react";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Index() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Redirect the user if they are not authenticated
    if (status === 'loading') return;
    if (!session) {
      window.location.href = "/";
    }
    console.log(session)
  }, [session]);
  
  const getLSLayout = (size: string) => {
    return getLS(`userLayout${tab}${size}`, DefaultLayout, true);
  };

  //component state
  const [tab, setTab] = useState(0);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('');
  const [layout, setLayout] = useState<Layout[]>(getLS(`userLayout${tab}`, DefaultLayout, true));
  const [layouts, setLayouts] = useState<Layouts>({
    xl: getLSLayout('xl'),
    lg: getLSLayout('lg'),
    md: getLSLayout('md'),
    sm: getLSLayout('sm'),
    xs: getLSLayout('xs'),
    xxs: getLSLayout('xxs')
  });
  const [isReady, setIsReady] = useState(false);
  const [movingToastShowed, setMovingToastShowed] = useState(false);
  const [userWidgets, setUserWidgets] = useState<UserWidget[]>(getLS(`userWidgets${tab}`, DefaultWidgets, true));
  const [modalShowed, setModalShowed] = useState(false);


  //callback functions
  const onLayoutChange =
    // useCallback(
    (currentLayout: ReactGridLayout.Layout[], allLayouts: Layouts) => {
      // resized done (from XL > LG):
      // onLayoutChange XL => onBreakpointChange LG (if changed => load & setLayout LG) => onLayoutChange LG

      // resized back (LG > XL)
      // onLayoutChange LG => onBreakpointChange XL  => onLayoutChange XL
      if (isReady) {
        if (movingToastShowed) {
          // only save layout when moving widgets
          // saveTabLS(tab, userWidgets, currentLayout);
          // saveTabDB(tab, userWidgets, currentLayout);
          localStorage.setItem(`userLayout${tab}${currentBreakpoint}`, JSON.stringify(currentLayout));
        }

        // TODO: HACK: for some reason, layout item's h was set to 1 at some point => change them back to 2
        currentLayout.forEach((item: Layout) => {
          if (isDoubleHeightWidget(item.i)) {
            item.h = 2;
          }
        });
        // setLayout(currentLayout);
        // setLayouts({
        //   xl: currentLayout,
        //   lg: currentLayout,
        //   md: currentLayout,
        //   sm: currentLayout,
        //   xs: currentLayout,
        //   xxs: currentLayout
        // });
        // console.log('--- currentLayout', currentLayout, allLayouts, isReady);
      }
    };
  const addWidget = (widget: Widget | null) => {
    setModalShowed(false);
    if (widget) {
      const wid = widget?.info?.wid + '-' + generateWID();
      userWidgets.push({
        wid
      });
      const newLayoutItem: Layout = { i: wid, x: 1, y: 1, w: widget?.info?.w ?? 1, h: widget?.info?.h ?? 1 };
      // console.log('newLayoutItem', newLayoutItem);

      const newLayout = [...layout];
      newLayout.push(newLayoutItem);

      setLayout(() => newLayout);
      setLayouts({
        xl: newLayout,
        lg: newLayout,
        md: newLayout,
        sm: newLayout,
        xs: newLayout,
        xxs: newLayout
      });
      // saveTabLS(tab, userWidgets, newLayout);
      // console.log('added', userWidgets, newLayout);
    }
  };
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList>
        <TabsTrigger value="dashboard 1">Dashboard 1</TabsTrigger>
        <TabsTrigger value="dashboard 2">Dashboard 2</TabsTrigger>
        <TabsTrigger value="+ Add Dashboard">+ Add Dashboard</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard 1">
        <div>
          <ResponsiveGridLayout
            draggableHandle=".draggableHandle"
            className="layout"
            layouts={layouts}
            onBreakpointChange={(newBreakpoint, newCols) => {
              if (newBreakpoint !== currentBreakpoint) {
                // if changed => save LG; load & setLayout LG
                setLayout(getLSLayout(newBreakpoint));
                setLayouts({
                  xl: getLSLayout('xl'),
                  lg: getLSLayout('lg'),
                  md: getLSLayout('md'),
                  sm: getLSLayout('sm'),
                  xs: getLSLayout('xs'),
                  xxs: getLSLayout('xxs')
                });
              }
              setCurrentBreakpoint(newBreakpoint);
            }}
            breakpoints={{ xl: 1500, lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ xl: 4, lg: 3, md: 2, sm: 2, xs: 1, xxs: 1 }}
            rowHeight={200}
            margin={[20, 20]}
            onLayoutChange={onLayoutChange}
            isResizable={false}
          >
            {userWidgets.map((widget: UserWidget, idx: number) => {
              const wid = widget?.wid ?? '';
              const type = wid.split('-')[0];
              const cn = ``;
              switch (type) {
                case 'weather':
                  return (
                    <div key={wid} className={cn}>
                      <Weather key={`${wid}-main`} wid={wid} />
                    </div>
                  );
                case 'analogclock':
                  return (
                    <div key={wid} className={cn}>
                      <AnalogClock key={`${wid}-main`} wid={wid} />
                    </div>
                  );
                case 'airq':
                  return (
                    <div key={wid} className={cn}>
                      <AirQuality key={`${wid}-main`} wid={wid} />
                    </div>
                  );
                case 'embed':
                  return (
                    <div key={wid} className={cn}>
                      <Embed key={`${wid}-main`} wid={wid} />
                    </div>
                  );
                case 'lofi':
                  return (
                    <div key={wid} className={cn}>
                      <LofiPlayer key={`${wid}-main`} wid={wid} />
                    </div>
                  );
                case 'note':
                  return (
                    <div key={wid} className={cn}>
                      <Note key={`${wid}-main`} wid={wid} />
                    </div>
                  );
                case 'quote':
                  return (
                    <div key={wid} className={cn}>
                      <Quote key={`${wid}-main`} wid={wid} />
                    </div>
                  );
                case 'rssreader':
                  return (
                    <div key={wid} className={cn}>
                      <RSSReader key={`${wid}-main`} wid={wid} />
                    </div>
                  );
                case 'stock':
                  return (
                    <div key={wid} className={cn}>
                      <StockChart key={`${wid}-main`} wid={wid} symbol="SPY" />
                    </div>
                  );
                case 'stockmini':
                  return (
                    <div key={wid} className={cn}>
                      <StockMini key={`${wid}-main`} wid={wid} symbol="SPY" />
                    </div>
                  );
                // case 'toggl':
                //   return (
                //     <div key={wid} className={cn}>
                //       <Toggl key={`${wid}-main`} wid={wid} />
                //     </div>
                //   );
                case 'orders':
                  return (
                    <div key={wid} className={cn}>
                      <OrderBook key={`${wid}-main`} wid={wid} />
                    </div>
                  );
                case 'solanachart':
                  return (
                    <div key={wid} className={cn}>
                      <SolanaPriceChart key={`${wid}-main`} wid={wid} />
                    </div>
                  );
                case 'BREAK':
                  return (
                    <div key={idx}>
                      <div key={`${idx}-main`} className="basis-full"></div>
                    </div>
                  );
              }
            })}
          </ResponsiveGridLayout>
          <div>
            <Button className="btn mt-4 ml-4 mb-4" onClick={() => setModalShowed(true)}>
              Add Widget
            </Button>
          </div>
          {modalShowed && <AddWidgetModal onCancel={() => setModalShowed(false)} onConfirm={addWidget} />}
        </div>
      </TabsContent>
      <TabsContent value="dashboard 2">Change your password here.</TabsContent>
    </Tabs>

  )
}
