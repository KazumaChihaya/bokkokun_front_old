import { ExclamationCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";
import { format } from 'date-fns';

import {
  ReserveBox,
  useDeleteReserveBoxMutation,
} from '../../../services/arrow-manage/artist';

export type ArtistDeleteProps = {
  reserve_box: ReserveBox;
};


const ReserveBoxDelete: React.FC<ArtistDeleteProps> = (props) => {

  const [visible, setVisible] = useState(false);
  const [confirm_modal, contextHolder] = Modal.useModal();

  const reserve_box = props.reserve_box;
  const { mutateAsync: deleteMutation } = useDeleteReserveBoxMutation();

  const commit = async () => {
    await deleteMutation({reserve_box_id: reserve_box.id, box_id: reserve_box.box_id, artist_id: reserve_box.artist_id});
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

export default ReserveBoxDelete;
