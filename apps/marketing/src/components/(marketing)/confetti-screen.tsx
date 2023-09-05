'use client';

import React, { useEffect, useState } from 'react';

import Confetti from 'react-confetti';
import { createPortal } from 'react-dom';

import { useIsMounted } from '@documenso/lib/client-only/hooks/use-is-mounted';
import { useWindowSize } from '@documenso/lib/client-only/hooks/use-window-size';

export default function ConfettiScreen(
  props: React.ComponentPropsWithoutRef<typeof Confetti> & { duration?: number },
) {
  const { width, height } = useWindowSize();
  const isMounted = useIsMounted();

  const [numberOfPieces, setNumberOfPieces] = useState(props.numberOfPieces ?? 200);

  useEffect(() => {
    if (!props.duration) {
      return;
    }

    const timer = setTimeout(() => {
      setNumberOfPieces(0);
    }, props.duration);

    return () => clearTimeout(timer);
  }, [props.duration]);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <Confetti
      {...props}
      className="w-full"
      numberOfPieces={numberOfPieces}
      width={width}
      height={height}
    />,
    document.body,
  );
}