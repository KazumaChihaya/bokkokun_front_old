import { ExclamationCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";
import { format } from 'date-fns';

import {
  useDeleteActiveBoxMutation,
} from '@/services/arrow-manage/artist';
import { useChangeLockMutation } from '@/services/arrow-manage/earn_invoice';

export type ChangeLockProps = {
  yearmonth: string;
  lock_type: boolean;
};


const ChangeLock: React.FC<ChangeLockProps> = (props) => {

  const [visible, setVisible] = useState(false);
  const [confirm_modal, contextHolder] = Modal.useModal();

  const yearmonth = props.yearmonth;
  const lock_type = props.lock_type;
  const { mutateAsync: calcMutation } = useChangeLockMutation();

  const commit = async () => {
    await calcMutation({yearmonth: yearmonth});
    setVisible(false);
    await message.success(lock_type ? '正常に未確定にしました' : '正常に確定済にしました');
  };

  const confirm = () => {
    Modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined />,
      content: lock_type ? '箱代を未確定しますか？' : '箱代を確定しますか？作家ページにも公開されます。',
      okText: lock_type ? '未確定にする' : '確定にする',
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
        {lock_type ? '未確定にする' : '確定する'}
      </Button>
    </>
  );
};

export default ChangeLock;
