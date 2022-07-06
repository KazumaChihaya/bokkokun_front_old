import { ExclamationCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";
import { format } from 'date-fns';

import {
  useDeleteActiveBoxMutation,
} from '@/services/arrow-manage/artist';
import { useStartCalcMutation } from '@/services/arrow-manage/earn_invoice';

export type StartCalcProps = {
  activeKey: string;
};


const StartCalc: React.FC<StartCalcProps> = (props) => {

  const [visible, setVisible] = useState(false);
  const [confirm_modal, contextHolder] = Modal.useModal();

  const yearmonth = props.activeKey;
  const { mutateAsync: calcMutation } = useStartCalcMutation();

  const commit = async () => {
    await calcMutation({yearmonth: yearmonth});
    setVisible(false);
    await message.success('正常に計算が完了しました');
  };

  const confirm = () => {
    Modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined />,
      content: '箱代の計算を開始しますか？その月が終わってから行なってください。',
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
        計算開始
      </Button>
    </>
  );
};

export default StartCalc;
