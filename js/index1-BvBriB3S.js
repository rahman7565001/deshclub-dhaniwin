import {
  b8 as defineComponent,
  t as useRouter,
  aZ as createElementBlock,
  aU as openBlock,
  b0 as createElementVNode,
  b1 as toDisplayString,
  aY as exportSfc
} from "./index-BgAwOX9Q.js";

const NavbarComponent = defineComponent({
  __name: "NavBar",
  props: {
    back: {
      type: Function,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    showLogo: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    let router;
    try {
      router = useRouter();
    } catch (e) {}

    const handleBack = () => {
      if (typeof props.back === "function") {
        props.back();
      } else if (router && typeof router.back === "function") {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      } else {
        window.location.href = "/";
      }
    };

    return (_ctx, _cache) => {
      return (
        openBlock(),
        createElementBlock(
          "header",
          { class: "game-top-nav-bar" },
          [
            createElementVNode(
              "div",
              {
                class: "game-nav-back-btn",
                onClick: handleBack
              },
              [
                createElementVNode(
                  "span",
                  { class: "nav-arrow-icon" },
                  "❮"
                ),
                createElementVNode(
                  "span",
                  { class: "nav-back-label" },
                  "Lobby"
                )
              ]
            ),
            createElementVNode(
              "div",
              { class: "game-nav-brand-title" },
              toDisplayString(props.title || (window._DATA_ && window._DATA_.homeSetting && window._DATA_.homeSetting.baseConfig && window._DATA_.homeSetting.baseConfig.webSiteName) || window.DESHCLUB_SITE_NAME || "Deshclub"),
              1
            ),
            createElementVNode(
              "div",
              {
                class: "game-nav-exit-btn",
                onClick: handleBack,
                title: "Exit to Lobby"
              },
              "✕"
            )
          ]
        )
      );
    };
  }
});

const N = exportSfc(NavbarComponent, [["__scopeId", "data-v-nav1b8e"]]);
export { N, N as default };
