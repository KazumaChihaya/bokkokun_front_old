import { ExclamationCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";
import { format } from 'date-fns';

import {
  useDeleteActiveBoxMutation,
} from '@/services/arrow-manage/artist';
import { useReCalcMutation } from '@/services/arrow-manage/box_invoice';

export type ReCalcProps = {
  activeKey: string;
  box_invoice_id: number;
};


const ReCalc: React.FC<ReCalcProps> = (props) => {

  const [visible, setVisible] = useState(false);
  const [confirm_modal, contextHolder] = Modal.useModal();

  const yearmonth = props.activeKey;
  const box_invoice_id = props.box_invoice_id;
  const { mutateAsync: calcMutation } = useReCalcMutation();

  const commit = async () => {
    await calcMutation({box_invoice_id: box_invoice_id});
    setVisible(false);
    await message.success('正常に計算が完了しました');
  };

  const confirm = () => {
    Modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined />,
      content: '箱代を再計算しますか？契約状況によって、全員の金額を再計算します。',
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

export default ReCalc;
