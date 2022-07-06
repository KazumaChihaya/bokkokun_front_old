import { ExclamationCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";
import { format } from 'date-fns';

import {
  useDeleteActiveBoxMutation,
} from '@/services/arrow-manage/artist';
import { useChangeStatusMutation } from '@/services/arrow-manage/earn_invoice';

export type ChangeStatusProps = {
  each_earn_invoice_id: number;
  artist_id: number;
  earn_invoice_id: number;
  status: boolean;
};


const ChangeStatus: React.FC<ChangeStatusProps> = (props) => {

  const [visible, setVisible] = useState(false);
  const [confirm_modal, contextHolder] = Modal.useModal();

  const artist_id = props.artist_id;
  const earn_invoice_id = props.earn_invoice_id;
  const each_earn_invoice_id = props.each_earn_invoice_id;
  const status = props.status;
  const { mutateAsync: calcMutation } = useChangeStatusMutation();

  const commit = async () => {
    await calcMutation({earn_invoice_id: earn_invoice_id, artist_id: artist_id, each_earn_invoice_id: each_earn_invoice_id});
    setVisible(false);
    await message.success(status ? '支払未完了にしました' : '支払完了にしました',);
  };

  const confirm = () => {
    Modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined />,
      content: status ? '箱代の支払を未にしますか？' : '箱代の支払を済にしますか？',
      okText: status ? '未にする' : '済にする',
      cancelText: 'キャンセル',
      onOk() {
        commit();
      },
      onCancel() {
        setVisible(false);
      },
    });
  };


  return (
    <Button
      style={{display: 'inline-block'}}
      icon={<TagsOutlined />}
      onClick={useCallback(confirm, [])}
    >
      {status ? '未にする' : '済にする'}
    </Button>
  );
};

export default ChangeStatus;
