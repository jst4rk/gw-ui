export interface IListResponse<ListType> {
  data: ListType,
  meta: {
      total: number
  }
}

export interface IDialogCloseData<DialogData> {
  data: DialogData;
  event: string;
}
