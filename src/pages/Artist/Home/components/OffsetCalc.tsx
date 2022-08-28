import { ExclamationCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { format } from 'date-fns';

import {
  useOffsetMutation,
} from '@/services/artist/home';

export type OffsetProps = {
  deposit: number,
  box_money?: number,
  yearmonth?: string,
};


const OffsetCalc: React.FC<OffsetProps> = (props) => {

  const [visible, setVisible] = useState(false);
  const [error_modal, contextHolder] = Modal.useModal();

  const yearmonth = props.yearmonth;
  const deposit = props.deposit;
  const box_money = props.box_money;
  const { mutateAsync: offsetMutation } = useOffsetMutation();

  const commit = async () => {
    if (!!yearmonth) {
      const res = await offsetMutation({yearmonth});
      setVisible(false);
      if (res.result == 'error') {
        error_modal.error({title: 'エラー', content: '支払ができませんでした。リロードをしてもう一度お試しください。'}); 
      } else {
        await message.success('正常に箱代が支払われました。');
      }
    }
  };

  const confirm = async () => {
    if (!!yearmonth && !!box_money) {
      if (deposit >= box_money) {
        Modal.confirm({
          title: '確認',
          icon: <ExclamationCircleOutlined />,
          content: '本当に' + format(new Date(yearmonth+'-01'), 'yyyy年MM月') + 'の箱代を売上残高から支払ってよろしいですか？',
          okText: '支払う',
          cancelText: 'キャンセル',
          onOk() {
            commit();
          },
          onCancel() {
            setVisible(false);
          },
        });
      } else {
        await message.error('残高が不足しているため支払うことができません。'); 
      }
    } else {
      await message.error('箱代の支払い対象がありません。'); 
    }
  };


  return (
    <>
      <Button
        icon={<TagsOutlined />}
        onClick={useCallback(confirm, [])}
        disabled={!yearmonth || !box_money}
      >
        {!!yearmonth && !!box_money ? 
          <>{format(new Date(yearmonth+'-01'), 'yyyy年MM月')}の箱代を支払</> : <>箱代支払対象なし</>}
      </Button>
      {contextHolder}
    </>
  );
};

export default OffsetCalc;
