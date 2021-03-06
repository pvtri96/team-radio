export default ({ spacing }) => ({
  emptyContainer: {
    paddingTop: spacing.doubleBaseMargin * 2,
    height: spacing.fullHeight,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: spacing.baseMargin,
  },
  gridList: {
    paddingTop: 20,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    // Promote the list into his own layer on Chrome. This cost memory but helps keefavoriteg high FPS.
    transform: 'translateZ(0)',
    overflowY: 'auto',
    overflowX: 'hidden',
    minWidth: 200,
  },
});
