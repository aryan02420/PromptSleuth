import { reactive } from '@vue/reactivity';
import { watch } from '@vue-reactivity/watch';
import { Workspace } from '@promptsleuth/core';
import { useEffect, useRef, useState } from 'react';

const _appState = reactive(new Workspace());

export function useGlobalState() {
  const appState = useRef(_appState);
  const [, rerender] = useState({});

  useEffect(() => {
    return watch(_appState, () => {
      rerender({});
    });
  }, [])

  return { state: appState.current };
}
