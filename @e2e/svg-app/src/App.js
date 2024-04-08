const App = () => (
  <svg width="200" height="300">
    <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />

    {/* <style>
      div {
        color: white;
        font: 18px serif;
        height: 100%;
        overflow: auto;
      }
    </style> */}

    <polygon points="5,105 195,110 185,285 10,295" />

    <foreignObject x="20" y="120" width="160" height="160">
      <div xmlns="http://www.w3.org/1999/xhtml" style="color: white; height: 100%">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis mollis mi ut ultricies. Nullam magna ipsum, porta vel dui convallis, rutrum imperdiet eros. Aliquam erat volutpat.</div>
    </foreignObject>
  </svg>
);

export { App };