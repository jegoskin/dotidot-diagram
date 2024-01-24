import { IServerData, IData, IInitialNode, IInitialEdges } from './typing';
import ReactFlow, { Controls } from 'reactflow';
import { useEffect, useState } from 'react';
import 'reactflow/dist/style.css';
import { generateEdges } from './components/generate-edges';
import { generateNodes } from './components/generate-nodes';

function Diagram() {
  const [ data, setData ] = useState<IData>()
  const [ initialNodesVariables, setInitialNodesVariables ] = useState<IInitialNode[]>([])
  const [ initialEdgesVariables, setInitialEdgesVariables ] = useState<IInitialEdges[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (data) {
      const nodes = generateNodes(data);
      const edges = generateEdges(data, nodes);

      setInitialNodesVariables(nodes);
      setInitialEdgesVariables(edges);
    }
  }, [data]);

  async function fetchData(): Promise<void> {
    const url = 'https://gist.githubusercontent.com/ondrejbartas/1d1f070808fe582475a752fd8dd9bc5c/raw/03ff2c97e5b9576017be7ad70fa345ecf7dafc94/example_data.json';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`FETCH ERROR! ${response.status}`);
      }
      const data: IServerData = await response.json();
      setData(data?.data)
    } catch (error) {
      alert('Error fetching data')
      console.error(error);
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={initialNodesVariables}
        edges={initialEdgesVariables}
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Diagram