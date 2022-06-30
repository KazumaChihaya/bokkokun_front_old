export const antize = (el: React.FC) => (
  <span className="anticon" role="img">
    {el({})}
  </span>
);
