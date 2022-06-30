import { createRef, Key } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

const FadeTransition: React.FC<{ transitionKey: Key | null | undefined }> = ({
  transitionKey,
  children,
}) => {
  const nodeRef = createRef<HTMLDivElement>();
  return (
    <SwitchTransition>
      <CSSTransition
        nodeRef={nodeRef}
        key={transitionKey}
        timeout={{ enter: 300, exit: 300 }}
        classNames="anim-fade"
      >
        <div ref={nodeRef}>{children}</div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default FadeTransition;
