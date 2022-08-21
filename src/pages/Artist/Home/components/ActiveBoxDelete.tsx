import { ExclamationCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";
import { format } from 'date-fns';

import {
  ActiveBox,
  useDeleteActiveBoxMutation,
} from '@/services/manager/artist';

export type ArtistDeleteProps = {
  active_box: ActiveBox;
};


const ActiveBoxDelete: React.FC<ArtistDeleteProps> = (props) => {

  const [visible, setVisible] = useState(false);
  const [confirm_modal, contextHolder] = Modal.useModal();

  const active_box = props.active_box;
  const { mutateAsync: deleteMutation } = useDeleteActiveBoxMutation();

  const commit = async () => {
    await deleteMutation({active_box_id: active_box.id, box_id: active_box.box_id, artist_id: active_box.artist_id});
    setVisible(false);
    await message.success('正常に削除しました');
  };

  const confirm = () => {
    Modal.confirm({
      title: '確認',
      icon: <ExclamationCircleOutlined />,
      content: '本当に契約情報の履歴を削除してよろしいですか？過去の情報を削除すると、箱代の請求情報との整合性が崩れる場合があります。',
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

export default ActiveBoxDelete;
