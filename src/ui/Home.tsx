import reactLogo from './assets/react.svg';
import './index.css';

import { useSelector, useDispatch } from 'react-redux';
import { increment } from './state/counterSlice';
import { type RootState } from './state/store';

export default function Home() {
  const count = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch();

  return (
    <div>
      <div className="p-4 bg-blue-500 h-96 w-full ">
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl">Vite + Reacts</h1>
      <div className="card">
        <div>{count.value}</div>
        <button onClick={() => dispatch(increment())}>Increment</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}
