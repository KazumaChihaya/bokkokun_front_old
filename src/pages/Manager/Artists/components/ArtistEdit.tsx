import { TagsOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';

import {
  AddArtistParam,
  Artist,
  useUpdateArtistMutation,
} from '@/services/arrow-manage/artist';

export type ArtistEditProps = {
  artist: Artist;
};


const ArtistEdit: React.FC<ArtistEditProps> = (props: ArtistEditProps) => {
  const artist = props.artist;
  const [modalVisibility, setModalVisibility] = useState(false);
  const [error_modal, contextHolder] = Modal.useModal();

  const [editValue, setEditValue] = useState<AddArtistParam>({
    name: artist.name,
    code: artist.code,
    mail: artist.mail,
    twitter: artist.twitter,
    instagram: artist.instagram,
    contact: artist.contact,
    rate: artist.rate,
  });

  const cleanupState = useCallback(() => {
    setEditValue({
      name: artist.name,
      code: artist.code,
      mail: artist.mail,
      twitter: artist.twitter,
      instagram: artist.instagram,
      contact: artist.contact,
      rate: artist.rate,
    });
  }, []);

  const validate = async(editValue: AddArtistParam) => {
    let errors: (boolean | JSX.Element)[] = [];

    errors.push(editValue.name !== '' || <p>作家名を入力してください。</p>);
    errors.push(editValue.code !== '' || <p>作家記号を入力してください。</p>);
    errors.push(editValue.mail !== '' || <p>メールアドレスを入力してください。</p>);
    errors.push(Number.isInteger(editValue.rate) || <p>手数料は半角数字で入力してください。</p>);
    errors.push(!Number.isInteger(editValue.rate) || editValue.rate >= 0 || editValue.rate <= 100 || <p>手数料は0以上100以下で入力してください。</p>);

    errors = errors.filter(error => typeof error !== 'boolean');
    if (errors.length == 0) {
      return null;
    } else {
      return {
        title: 'エラー',
        content: errors,
      };
    }
  }

  const { mutateAsync: editMutation } = useUpdateArtistMutation();

  const commit = async () => {
    const errors = await validate(editValue);
    if (errors) {
      error_modal.error(errors);
    } else {
      await editMutation({id: artist.id, data: editValue});

      setModalVisibility(false);
      await message.success('正常に更新しました');
    }
  };

  const labelAlign: FormLabelAlign = 'left';
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    labelAlign: labelAlign,
    colon: false,
  };

  

  return (
    <>
      <Button
        icon={<TagsOutlined />}
        onClick={useCallback(() => setModalVisibility(true), [])}
      >
        情報を編集
      </Button>
      <Modal
        key="add_modal"
        afterClose={cleanupState}
        title="作家の基本情報を編集"
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        onOk={commit}
        okText="実行"
      >
        <Form name="add_artist">
        <Form.Item
            {...formItemLayout}
            name="name"
            label="作家名"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input value={editValue.name} defaultValue={editValue.name} onChange={(e) => {
              setEditValue({ ...editValue, name: e.target.value });
            }}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="code"
            label="作家記号"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input value={editValue.code} defaultValue={editValue.code} onChange={(e) => {
              setEditValue({ ...editValue, code: e.target.value });
            }}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="mail"
            label="メールアドレス"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input value={editValue.mail} defaultValue={editValue.mail} onChange={(e) => {
              setEditValue({ ...editValue, mail: e.target.value });
            }}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="twitter"
            label="Twitter"
          >
            <Input value={editValue.twitter} defaultValue={editValue.twitter} placeholder="@を入れない" onChange={(e) => {
              setEditValue({ ...editValue, twitter: e.target.value });
            }}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="instagram"
            label="Instagram"
          >
            <Input value={editValue.instagram} defaultValue={editValue.instagram} onChange={(e) => {
              setEditValue({ ...editValue, instagram: e.target.value });
            }}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="contact"
            label="連絡方法"
            rules={[
              {
                required: true,
              },
            ]} 
          >
            <Select style={{ width: '100%' }} defaultValue={String(editValue.contact)} onChange={(e) => {
              setEditValue({ ...editValue, contact: Number(e) });
            }}>
              <Option value="0">メール</Option>
              <Option value="1">Twitter</Option>
              <Option value="2">Instagram</Option>
            </Select>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="rate"
            label="手数料"
            rules={[
              {
                required: true,
              },
            ]} 
          >
            <InputNumber value={editValue.rate} min={0} max={100} defaultValue={editValue.rate} onChange={(e) => {
              setEditValue({ ...editValue, rate: Number(e) });
            }}/>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default ArtistEdit;
