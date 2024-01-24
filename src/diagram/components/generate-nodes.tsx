import { IData, IInitialNode, IKeyword } from '../typing';

const positionXShift: number = 300
const positionYShift: number = 100
const positionCampaign: number = 500
const positionYShiftExports: number = 200

export function generateNodes(data: IData) {
  const nodes: IInitialNode[] = []

  let rowOffset: number = 0
  let rowOffsetExports: number = 0
  let columnOffset: number = 0

  // generate var nodes
  data?.variables.variables
    .filter(filterItem => filterItem.additionalSource === null)
    .forEach(varItem => {
      nodes.push({
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

  // generate additional nodes
  data?.additionalSources.additionalSources
    .forEach(varItem => {
      nodes.push({
        id: rowOffset.toString(),
        sourcePosition: 'right',
        targetPosition: 'left',
        position: { x: columnOffset * positionXShift, y: rowOffset * positionYShift },
        data: { label: varItem.name, originalId: varItem.id.toString(), placeholderName: varItem.placeholderName },
        style: { backgroundColor: '#ffc96c' }
      })
      rowOffset++
    })
  columnOffset++

  // generate var additional nodes
  data?.variables.variables
    .filter(filterItem => filterItem.additionalSource !== null)
    .forEach(varItem => {
      nodes.push({
        id: rowOffset.toString(),
        sourcePosition: 'right',
        targetPosition: 'left',
        position: { x: columnOffset * positionXShift, y: rowOffset * positionYShift },
        data: { label: varItem.name, placeholderName: varItem.placeholderName, originalId: varItem.id.toString(), },
        style: { backgroundColor: '#3b95f6' }
      })
      rowOffset++
    })
  columnOffset++

  // generate campaign settings nodes
  data?.campaignSettings.campaignSettings
    .forEach(campaignItem => {
      nodes.push({
        id: rowOffset.toString(),
        sourcePosition: 'right',
        targetPosition: 'left',
        position: { x: columnOffset * positionXShift, y: positionCampaign + rowOffset },
        data: { label: campaignItem.name, originalId: campaignItem.id.toString() },
        style: { backgroundColor: '#ede7f8', minHeight: '100px' }
      })
      rowOffset++
    })
  columnOffset++

  // generate feed exports nodes
  data?.feedExports.feedExports
    .forEach(exportItem => {
      nodes.push({
        id: rowOffset.toString(),
        type: "output",
        targetPosition: 'left',
        position: { x: columnOffset * positionXShift, y: rowOffsetExports * positionYShiftExports },
        data: { label: exportItem.name, originalId: exportItem.id.toString() },
        style: { backgroundColor: '#ede7f8', minHeight: '100px', border: '2px solid red' }
      })
      rowOffset++
      rowOffsetExports++
    })

  // generate adwords keywords nodes
    data?.campaignSettings.campaignSettings
      .forEach(campaignItem => {
        nodes.push({
          id: rowOffset.toString(),
          type: "output",
          targetPosition: 'left',
          position: { x: columnOffset * positionXShift, y: rowOffsetExports * positionYShiftExports },
          data: { label: 'Google Ads Settings', originalId: campaignItem.adwordsSetting.id.toString() },
          style: { backgroundColor: '#ede7f8', border: '2px solid red' }
        })
        rowOffset++
        rowOffsetExports++

        const keywordSettings: IKeyword[] = campaignItem.keywordSettings
        keywordSettings
          .forEach(keywordItem => {
            nodes.push({
              id: rowOffset.toString(),
              type: "output",
              targetPosition: 'left',
              position: { x: columnOffset * positionXShift, y: rowOffsetExports * positionYShiftExports },
              data: { label: keywordItem.name, originalId: keywordItem.id.toString() },
              style: { backgroundColor: '#ede7f8', minHeight: '100px', border: '2px solid red' }
            })
          rowOffset++
          rowOffsetExports++
        })

      rowOffset++
      rowOffsetExports++
    })

  return nodes;
}
