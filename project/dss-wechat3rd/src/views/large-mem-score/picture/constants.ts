export const PictureStatus = {
  WAIT_CHECK: 0,
  SUCCESS: 1,
  REJECTED: 2,
};

export const PictureStatusMap = {
  [PictureStatus.WAIT_CHECK]: '待审核',
  [PictureStatus.SUCCESS]: '审核成功',
  [PictureStatus.REJECTED]: '驳回',
};
