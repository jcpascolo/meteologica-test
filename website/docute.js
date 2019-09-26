new Docute({
  target: "#docute",
  sidebar: JSON.parse(
    "[{&#34;title&#34;:&#34;BASIC&#34;,&#34;links&#34;:[{&#34;title&#34;:&#34;App&#34;,&#34;link&#34;:&#34;/components/App&#34;},{&#34;title&#34;:&#34;DataSection&#34;,&#34;link&#34;:&#34;/components/DataSection&#34;},{&#34;title&#34;:&#34;Graph&#34;,&#34;link&#34;:&#34;/components/Graph&#34;},{&#34;title&#34;:&#34;ToggleButton&#34;,&#34;link&#34;:&#34;/components/ToggleButton&#34;}]}]".replace(
      /\&\#34\;/g,
      '"'
    )
  )
});
