"use client";

import { Responsive, WidthProvider } from "react-grid-layout";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { useKeys, useUser } from "#/app/my/layout";
import { getTrades } from "#/server/trades";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const DistributionByCoin = dynamic(() =>
  import("#/client/My/Analytics/widgets/distribution-by-coin")
);
const DistributionBySide = dynamic(() =>
  import("#/client/My/Analytics/widgets/distribution-by-side")
);
const CounterOfTrades = dynamic(() =>
  import("#/client/My/Analytics/widgets/counter-of-trades")
);
const CumulativeCommission = dynamic(() =>
  import("#/client/My/Analytics/widgets/cumulative-commission")
);
const CoinVolume = dynamic(() =>
  import("#/client/My/Analytics/widgets/coin-volume")
);

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function WidgetsLayout({ widgets, setWidgets }) {
  const {
    user: { id },
  } = useUser();
  const { keys } = useKeys();

  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (keys.length > 0) {
      getTrades(id).then((t) => {
        setTrades(t);
      });
    }
  }, [keys]);

  function handleDeleteWidget(ID) {
    setWidgets((prev) => {
      const b = prev.filter((widget) => widget.id !== ID);
      localStorage.setItem("widgets", JSON.stringify(b));
      return b;
    });
  }

  return (
    <ResponsiveGridLayout
      draggableHandle=".drag-header"
      rowHeight={35}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 16, md: 14, sm: 10, xs: 8, xxs: 6 }}
      onResizeStop={(l, o, n) => {
        localStorage.setItem(
          "widgets",
          JSON.stringify(
            JSON.parse(localStorage.getItem("widgets")).map((widget) =>
              widget.id === Number(n.i) ? { ...widget, w: n.w, h: n.h } : widget
            )
          )
        );
      }}
      onDragStop={(l, o, n) => {
        localStorage.setItem(
          "widgets",
          JSON.stringify(
            JSON.parse(localStorage.getItem("widgets")).map((widget) =>
              widget.id === Number(n.i) ? { ...widget, x: n.x, y: n.y } : widget
            )
          )
        );
      }}
    >
      {widgets.length > 0
        ? widgets.map((widget) => {
            switch (widget.id) {
              case 1:
                return (
                  <div
                    key="1"
                    data-grid={{
                      x: widget.x,
                      y: widget.y,
                      w: widget.w,
                      h: widget.h,
                    }}
                  >
                    <DistributionByCoin
                      key={1}
                      trades={trades}
                      onDeleteWidget={() => handleDeleteWidget(1)}
                    />
                  </div>
                );
              case 2:
                return (
                  <div
                    key="2"
                    data-grid={{
                      x: widget.x,
                      y: widget.y,
                      w: widget.w,
                      h: widget.h,
                    }}
                  >
                    <DistributionBySide
                      key={2}
                      trades={trades}
                      onDeleteWidget={() => handleDeleteWidget(2)}
                    />
                  </div>
                );
              case 3:
                return (
                  <div
                    key="3"
                    data-grid={{
                      x: widget.x,
                      y: widget.y,
                      w: widget.w,
                      h: widget.h,
                    }}
                  >
                    <CounterOfTrades
                      key={3}
                      trades={trades}
                      onDeleteWidget={() => handleDeleteWidget(3)}
                    />
                  </div>
                );
              case 4:
                return (
                  <div
                    key="4"
                    data-grid={{
                      x: widget.x,
                      y: widget.y,
                      w: widget.w,
                      h: widget.h,
                    }}
                  >
                    <CumulativeCommission
                      key={4}
                      trades={trades}
                      onDeleteWidget={() => handleDeleteWidget(4)}
                    />
                  </div>
                );
              case 5:
                return (
                  <div
                    key="5"
                    data-grid={{
                      x: widget.x,
                      y: widget.y,
                      w: widget.w,
                      h: widget.h,
                    }}
                  >
                    <CoinVolume
                      key={5}
                      trades={trades}
                      onDeleteWidget={() => handleDeleteWidget(5)}
                    />
                  </div>
                );
              default:
                return null;
            }
          })
        : null}
    </ResponsiveGridLayout>
  );
}
