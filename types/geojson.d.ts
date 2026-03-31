declare module '*.geojson' {
  const value: import('@/types/site').StrandedSitesCollection;
  export default value;
}
