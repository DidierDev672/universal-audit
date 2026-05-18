import { h, type Component } from "vue";

export function svgIcon(pathD: string): Component {
  return {
    render: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: pathD,
        }),
      ]),
  };
}
