import { IServerData, IData, IInitialNode, IInitialEdges, IKeyword } from './typing';
import ReactFlow, { Controls } from 'reactflow';
import { useEffect, useState } from 'react';
import 'reactflow/dist/style.css';

const positionXShift: number = 300
const positionYShift: number = 100
const positionYShiftExports: number = 200

function Diagram() {
  const [ data, setData ] = useState<IData>()
  const [ initialNodesVariables, setInitialNodesVariables ] = useState<IInitialNode[]>([])
  const [ initialEdgesVariables, setInitialEdgesIVariables ] = useState<IInitialEdges[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    generateInitialNodes()
  }, [data])

  function generateInitialNodes() {
    if (data) {
      const varTemp: IInitialNode[] = []
      const edgeTemp: IInitialEdges[] = []

      let rowOffset: number = 0
      let rowOffsetExports: number = 0
      let columnOffset: number = 0

      data.variables.variables.filter(filterItem => filterItem.additionalSource === null).forEach(varItem => {
        varTemp.push({
          id: rowOffset.toString(),
          type: "input",
          sourcePosition: 'right',
          position: { x: columnOffset, y: rowOffset * positionYShift },
          data: { label: varItem.name, placeholderName: varItem.placeholderName },
          style: { backgroundColor: '#3b95f6' }
        })
        rowOffset++
      })
      columnOffset++

      data.additionalSources.additionalSources.forEach(varItem => {
        const mappingFields: string[] = [...varItem.mappingFields, varItem.mappingField]

        mappingFields.forEach(fieldItem => {
          const source: IInitialNode | undefined = varTemp.find(findVarItem => findVarItem.data.placeholderName === fieldItem);
          if (source) {
            edgeTemp.push({
              id: `e${source.id}-${rowOffset.toString()}`,
              source: source.id,
              target: rowOffset.toString(),
            })
          }
        })

        varTemp.push({
          id: rowOffset.toString(),
          sourcePosition: 'right',
          targetPosition: 'left',
          position: { x: columnOffset * positionXShift, y: rowOffset * positionYShift },
          data: { label: varItem.name, originalId: varItem.id, placeholderName: varItem.placeholderName  },
          style: { backgroundColor: '#ffc96c' }
        })
        rowOffset++
      })
      columnOffset++

      data.variables.variables.filter(filterItem => filterItem.additionalSource !== null).forEach(varItem => {
        const additionalSourceId: string = varItem.additionalSource.id

        const source: IInitialNode | undefined = varTemp.find(findVarItem => findVarItem.data.originalId === additionalSourceId);
        if (source) {
          edgeTemp.push({
            id: `e${source.id}-${rowOffset.toString()}`,
            source: source.id,
            target: rowOffset.toString(),
          })
        }

        varTemp.push({
          id: rowOffset.toString(),
          sourcePosition: 'right',
          targetPosition: 'left',
          position: { x: columnOffset * positionXShift, y: rowOffset * positionYShift },
          data: { label: varItem.name, placeholderName: varItem.placeholderName  },
          style: { backgroundColor: '#3b95f6' }
        })
        rowOffset++
      })
      columnOffset++

      data.campaignSettings.campaignSettings.forEach(campaignItem => {
        const placeholders: string[] = [...new Set([ ...campaignItem.getConditionsPlaceholders, ...campaignItem.getPlaceholdersWithoutConditions ])]
        
        placeholders.forEach(placeholderItem => {
          const source: IInitialNode | undefined = varTemp.find(findVarItem => findVarItem.data.placeholderName === placeholderItem);
          if (source) {
            edgeTemp.push({
              id: `e${source.id}-${rowOffset.toString()}`,
              source: source.id,
              target: rowOffset.toString(),
            })
          }
        })

        varTemp.push({
          id: rowOffset.toString(),
          sourcePosition: 'right',
          targetPosition: 'left',
          position: { x: columnOffset * positionXShift, y: 5 * positionYShift },
          data: { label: campaignItem.name, originalId: campaignItem.id },
          style: { backgroundColor: '#ede7f8', minHeight: '100px' }
        })
        rowOffset++
      })
      columnOffset++

      data.feedExports.feedExports.forEach(exportItem => {
        const placeholders: string[] = [...new Set([ ...exportItem.getConditionsPlaceholders, ...exportItem.getPlaceholdersWithoutConditions ])]
        placeholders.forEach(placeholderItem => {
          const source: IInitialNode | undefined = varTemp.find(findVarItem => findVarItem.data.placeholderName === placeholderItem);
          if (source) {
            edgeTemp.push({
              id: `e${source.id}-${rowOffset.toString()}`,
              source: source.id,
              target: rowOffset.toString(),
            })
          }
        })

        varTemp.push({
          id: rowOffset.toString(),
          type: "output",
          targetPosition: 'left',
          position: { x: columnOffset * positionXShift, y: rowOffsetExports * positionYShiftExports },
          data: { label: exportItem.name },
          style: { backgroundColor: '#ede7f8', minHeight: '100px', border: '2px solid red' }
        })
        rowOffset++
        rowOffsetExports++
      })

      data.campaignSettings.campaignSettings.forEach(campaignItem => {
        const campaignItemId = campaignItem.id
        const source: IInitialNode | undefined = varTemp.find(findVarItem => findVarItem.data.originalId === campaignItemId);
        if (source) {
          edgeTemp.push({
            id: `e${source.id}-${rowOffset.toString()}`,
            source: source.id,
            target: rowOffset.toString(),
          })
        }

        const placeholders: string[] = [ ...campaignItem.getPlaceholdersWithoutConditions ]
        placeholders.forEach(placeholderItem => {
          const source: IInitialNode | undefined = varTemp.find(findVarItem => findVarItem.data.placeholderName === placeholderItem);
          if (source) {
            edgeTemp.push({
              id: `e${source.id}-${rowOffset.toString()}`,
              source: source.id,
              target: rowOffset.toString(),
            })
          }
        })

        varTemp.push({
          id: rowOffset.toString(),
          type: "output",
          targetPosition: 'left',
          position: { x: columnOffset * positionXShift, y: rowOffsetExports * positionYShiftExports },
          data: { label: 'Google Ads Settings' },
          style: { backgroundColor: '#ede7f8', border: '2px solid red' }
        })
        rowOffset++
        rowOffsetExports++
      })

      data.campaignSettings.campaignSettings.forEach(campaignItem => {
        const keywordSettings: IKeyword[] = campaignItem.keywordSettings
        keywordSettings.forEach(keywordItem => {
          const campaignItemId = campaignItem.id
          const source: IInitialNode | undefined = varTemp.find(findVarItem => findVarItem.data.originalId === campaignItemId);
          if (source) {
            edgeTemp.push({
              id: `e${source.id}-${rowOffset.toString()}`,
              source: source.id,
              target: rowOffset.toString(),
            })
          }

          const placeholders: string[] = [...new Set([ ...keywordItem.getConditionsPlaceholders, ...keywordItem.getPlaceholdersWithoutConditions ])]
          placeholders.forEach(placeholderItem => {
            const source: IInitialNode | undefined = varTemp.find(findVarItem => findVarItem.data.placeholderName === placeholderItem);
            if (source) {
              edgeTemp.push({
                id: `e${source.id}-${rowOffset.toString()}`,
                source: source.id,
                target: rowOffset.toString(),
              })
            }
          })

          varTemp.push({
            id: rowOffset.toString(),
            type: "output",
            targetPosition: 'left',
            position: { x: columnOffset * positionXShift, y: rowOffsetExports * positionYShiftExports },
            data: { label: keywordItem.name },
            style: { backgroundColor: '#ede7f8', minHeight: '100px', border: '2px solid red' }
          })
          rowOffset++
          rowOffsetExports++
        })

      })
      columnOffset++

      setInitialNodesVariables(varTemp)
      setInitialEdgesIVariables(edgeTemp)
    }
  }

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