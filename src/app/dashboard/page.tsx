"use client"
import { isDoubleHeightWidget } from "@/components/widgets";
import Weather from "@/components/widgets/Weather/Weather";
import { getLS } from "@/lib/appUtils";
import { DefaultLayout } from "@/lib/constants";
import { auth } from "auth"
import { useState } from "react";
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Index() {

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
  return (
    <div
    // style={{
    //   background: `url(https://as1.ftcdn.net/v2/jpg/05/72/26/54/1000_F_572265495_aMlExbdRAhNxoFYv6RT12HB6TRtoGok5.jpg)`,
    //   backgroundSize: 'cover'
    // }}
    >
      <ResponsiveGridLayout
        draggableHandle=".draggableHandle"
        className="layout"
        // layout={layout}
        // layouts={{ xl: layout, lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
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
          // console.log('onBreakpointChange', newBreakpoint, newCols);
          // setLayouts({ ...layouts });
        }}
        // cols={4}
        breakpoints={{ xl: 1500, lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ xl: 4, lg: 3, md: 2, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={200}
        // width={1600}
        margin={[20, 20]}
        onLayoutChange={onLayoutChange}
        isResizable={false}
      >
        <div key={'123'} className={'cn'}>
          <Weather key={`${'wid'}-main`} wid={'weather'} />
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}
