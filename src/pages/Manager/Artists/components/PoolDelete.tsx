import { ExclamationCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";
import { format } from 'date-fns';

import {
  Pool,
  useDeletePoolMutation,
} from '@/services/arrow-manage/pool';

export type ArtistDeleteProps = {
  pool: Pool;
};


const PoolDelete: React.FC<ArtistDeleteProps> = (props) => {

  const [visible, setVisible] = useState(false);
  const [confirm_modal, contextHolder] = Modal.useModal();

  const pool = props.pool;
  const { mutateAsync: deleteMutation } = useDeletePoolMutation();

  const commit = async () => {
    await deleteMutation({pool_id: pool.id, artist_id: pool.artist_id});
    setVisible(false);
    await message.success('正常に削除しました');
  };

  const confirm = () => {
    Modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined />,
      content: '本当にプール履歴を削除してよろしいですか？計算にも影響します。',
      okText: '削除する',
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
        削除
      </Button>
    </>
  );
};

export default PoolDelete;
