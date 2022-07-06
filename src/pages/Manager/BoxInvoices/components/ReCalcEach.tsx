import { ExclamationCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";
import { format } from 'date-fns';

import {
  useDeleteActiveBoxMutation,
} from '@/services/manager/artist';
import { useReCalcEachMutation } from '@/services/manager/box_invoice';

export type ReCalcEachProps = {
  artist_id: number;
  each_box_invoice_id: number;
  box_invoice_id: number;
};


const ReCalcEach: React.FC<ReCalcEachProps> = (props) => {

  const [visible, setVisible] = useState(false);
  const [confirm_modal, contextHolder] = Modal.useModal();

  const box_invoice_id = props.box_invoice_id;
  const each_box_invoice_id = props.each_box_invoice_id;
  const artist_id = props.artist_id;
  const { mutateAsync: calcMutation } = useReCalcEachMutation();

  const commit = async () => {
    await calcMutation({box_invoice_id: box_invoice_id, each_box_invoice_id: each_box_invoice_id, artist_id: artist_id});
    setVisible(false);
    await message.success('正常に計算が完了しました');
  };

  const confirm = () => {
    Modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined />,
      content: '箱代を再計算しますか？契約状況によって、金額を再計算します。',
      okText: '開始する',
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
    <>
      <Button
        icon={<TagsOutlined />}
        onClick={useCallback(confirm, [])}
      >
        再計算
      </Button>
    </>
  );
};

export default ReCalcEach;
