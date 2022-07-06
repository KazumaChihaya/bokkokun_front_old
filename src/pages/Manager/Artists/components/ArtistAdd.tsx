import { TagsOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';

import {
  AddArtistParam,
  Artist,
  useCreateArtistMutation,
} from '@/services/arrow-manage/artist';

export type ArtistAddProps = {
  artist: Artist;
};


const ArtistAdd: React.FC = () => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [error_modal, contextHolder] = Modal.useModal();

  const [addValue, setAddValue] = useState<AddArtistParam>({
    name: '',
    code: '',
    mail: '',
    twitter: '',
    instagram: '',
    contact: 0,
    rate: 20,
  });

  const cleanupState = useCallback(() => {
    setAddValue({
      name: '',
      code: '',
      mail: '',
      twitter: '',
      instagram: '',
      contact: 0,
      rate: 20,
    });
  }, []);

  const validate = async(addValue: AddArtistParam) => {
    let errors: (boolean | JSX.Element)[] = [];

    errors.push(addValue.name !== '' || <p>作家名を入力してください。</p>);
    errors.push(addValue.code !== '' || <p>作家記号を入力してください。</p>);
    errors.push(addValue.mail !== '' || <p>メールアドレスを入力してください。</p>);
    errors.push(Number.isInteger(addValue.rate) || <p>手数料は半角数字で入力してください。</p>);
    errors.push(!Number.isInteger(addValue.rate) || addValue.rate >= 0 || addValue.rate <= 100 || <p>手数料は0以上100以下で入力してください。</p>);

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

  const { mutateAsync: addMutation } = useCreateArtistMutation();

  const commit = async () => {
    const errors = await validate(addValue);
    if (errors) {
      console.log(errors);
      error_modal.error(errors);
    } else {
      await addMutation(addValue);

      setModalVisibility(false);
      await message.success('正常に追加しました');
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
        作家を追加
      </Button>
      <Modal
        key="add_modal"
        afterClose={cleanupState}
        title="作家を追加"
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
            <Input value={addValue.name} defaultValue={addValue.name} onChange={(e) => {
              setAddValue({ ...addValue, name: e.target.value });
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
            <Input value={addValue.code} defaultValue={addValue.code} onChange={(e) => {
              setAddValue({ ...addValue, code: e.target.value });
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
            <Input value={addValue.mail} defaultValue={addValue.mail} onChange={(e) => {
              setAddValue({ ...addValue, mail: e.target.value });
            }}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="twitter"
            label="Twitter"
          >
            <Input value={addValue.twitter} defaultValue={addValue.twitter} placeholder="@を入れない" onChange={(e) => {
              setAddValue({ ...addValue, twitter: e.target.value });
            }}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="instagram"
            label="Instagram"
          >
            <Input value={addValue.instagram} defaultValue={addValue.instagram} onChange={(e) => {
              setAddValue({ ...addValue, instagram: e.target.value });
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
            <Select style={{ width: '100%' }} defaultValue={String(addValue.contact)} onChange={(e) => {
              setAddValue({ ...addValue, contact: Number(e) });
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
            <InputNumber value={addValue.rate} min={0} max={100} defaultValue={addValue.rate} onChange={(e) => {
              setAddValue({ ...addValue, rate: Number(e) });
            }}/>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default ArtistAdd;
