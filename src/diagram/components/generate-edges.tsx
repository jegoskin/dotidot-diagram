import { IData, IInitialNode, IInitialEdges } from '../typing';
import { connectById, connectByPlaceholder } from './connect-edges';

export function generateEdges(data: IData, nodes: IInitialNode[]): IInitialEdges[] {
  const edges: IInitialEdges[] = [];

  data.variables.variables
    .filter(filterItem => filterItem.additionalSource !== null)
    .forEach(variable => {
      const newEdges = connectById(variable.additionalSource.id.toString(), variable.id.toString(), nodes)
      if (newEdges?.length !== 0) {
        edges.push(...newEdges)
      }
  });

  data.additionalSources.additionalSources
    .forEach(varItem => {
      const mappingFields: string[] = [...varItem.mappingFields, varItem.mappingField]
      const newEdges = connectByPlaceholder(mappingFields, varItem.id.toString(), nodes)
      if (newEdges?.length !== 0) {
        edges.push(...newEdges)
      }
  });

  data.campaignSettings.campaignSettings
    .forEach(campaignItem => {
      const placeholders: string[] = [...new Set([ ...campaignItem.getConditionsPlaceholders, ...campaignItem.getPlaceholdersWithoutConditions ])]
      const newEdgesCampaignToVar = connectByPlaceholder(placeholders, campaignItem.id.toString(), nodes)
      if (newEdgesCampaignToVar?.length !== 0) {
        edges.push(...newEdgesCampaignToVar)
      }

      const adwordsMapping: string[] = [...campaignItem.adwordsSetting.getPlaceholdersWithoutConditions]
      const newEdgesAdwordsToVar = connectByPlaceholder(adwordsMapping, campaignItem.adwordsSetting.id.toString(), nodes)
      if (newEdgesAdwordsToVar?.length !== 0) {
        edges.push(...newEdgesAdwordsToVar)
      }

      const newEdgesAdwordsToCamping = connectById(campaignItem.id.toString(), campaignItem.adwordsSetting.id.toString(), nodes)
      if (newEdgesAdwordsToCamping?.length !== 0) {
        edges.push(...newEdgesAdwordsToCamping)
      }

      campaignItem.keywordSettings
        .forEach((keywordItem: any) => {
          const mappingFields: string[] = [...keywordItem.getPlaceholdersWithoutConditions]
          const newEdgesKeywordsToVar = connectByPlaceholder(mappingFields, keywordItem.id.toString(), nodes)
          if (newEdgesKeywordsToVar?.length !== 0) {
            edges.push(...newEdgesKeywordsToVar)
          }

          const newEdgesKeywordsToCamping = connectById(campaignItem.id.toString(), keywordItem.id.toString(), nodes)
          if (newEdgesKeywordsToCamping?.length !== 0) {
            edges.push(...newEdgesKeywordsToCamping)
          }
      });
  });

  data.feedExports.feedExports
    .forEach(exportItem => {
      const placeholders: string[] = [...new Set([ ...exportItem.getConditionsPlaceholders, ...exportItem.getPlaceholdersWithoutConditions ])]
      const newEdges = connectByPlaceholder(placeholders, exportItem.id.toString(), nodes)
      if (newEdges?.length !== 0) {
        edges.push(...newEdges)
      }
  })

  return edges;
}