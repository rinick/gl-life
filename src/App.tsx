import React from 'react';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import Dropdown from 'antd/lib/dropdown';
import Menu, {ClickParam} from 'antd/lib/menu';
import Layout from 'antd/lib/layout';
import Upload from 'antd/lib/upload';
import {RcFile} from 'antd/lib/upload/interface';
import CaretRightOutlined from '@ant-design/icons/CaretRightOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import PauseOutlined from '@ant-design/icons/PauseOutlined';
import StepForwardOutlined from '@ant-design/icons/StepForwardOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import UploadOutlined from '@ant-design/icons/UploadOutlined';

import {Stage} from './Stage';
import {LoadImage, Preset, presets} from './Presets';
import {t} from './Util';

const {Option} = Select;
const {Sider, Content} = Layout;

type SpeedEnum = 'snail' | 'tortoise' | 'hare' | 'cheetah' | 'blue-hedgehog';
const speedMap = {
  'snail': 2560,
  'tortoise': 640,
  'hare': 160,
  'cheetah': 40,
  'falcon': 1,
  'blue-hedgehog': 0,
};

interface State {
  speed: SpeedEnum;
  useVirus: boolean;
  playing: boolean;
}

export class App extends React.PureComponent<any, State> {
  state: State = {speed: 'cheetah', playing: true, useVirus: true};

  _stage!: Stage;
  getStageRef = (s: Stage): void => {
    this._stage = s;
  };

  onSpeedChange = (speed: SpeedEnum) => {
    let {playing} = this.state;
    this.setState({speed});
  };
  onPlay = () => {
    let {speed} = this.state;
    this.setState({playing: true});
  };
  onPause = () => {
    this.setState({playing: false});
  };
  onStep = () => {
    this._stage?.step();
  };
  onSave = () => {
    this._stage?.save();
  };
  onLoad = (file: RcFile) => {
    let loadImage = new LoadImage(null, null, file);
    loadImage.load().then(() => this._stage?.reload(loadImage));
    return false;
  };

  handleExampleClick = async (param: ClickParam) => {
    let preset = presets[param.key];
    if (preset.load) {
      await preset.load();
    }
    this._stage?.reload(preset);
  };

  examplesMenu = (
    <Menu onClick={this.handleExampleClick}>
      {Object.keys(presets).map((p) => {
        let preset = presets[p];
        return <Menu.Item key={p}>{t(preset.en, preset.zh)}</Menu.Item>;
      })}
    </Menu>
  );

  render() {
    let {speed, playing, useVirus} = this.state;
    let speedms = Infinity;
    if (playing) {
      speedms = speedMap[speed];
    }
    return (
      <Layout className="stage-layout">
        <Content>
          <Stage delay={speedms} useVirus={useVirus} ref={this.getStageRef} />
        </Content>
        <Sider breakpoint="lg" collapsedWidth="0" reverseArrow theme="light" width={300}>
          <div className="sider">
            <div className="sider-item">
              {playing ? (
                <Button type="primary" icon={<PauseOutlined />} onClick={this.onPause}>
                  {t('Pause', '暂停')}
                </Button>
              ) : (
                <Button type="primary" icon={<CaretRightOutlined />} onClick={this.onPlay}>
                  {t('Start', '开始')}
                </Button>
              )}
              <Button icon={<StepForwardOutlined />} disabled={speedms < 1000} onClick={this.onStep}>
                {t('Step', '单步')}
              </Button>
            </div>
            <div className="sider-item">
              <span className="sider-label">{t('Speed: ', '速度: ')}</span>
              <Select value={speed} style={{width: 120}} onChange={this.onSpeedChange}>
                <Option value="snail"> {t('Snail', '蜗牛')}</Option>
                <Option value="tortoise"> {t('Tortoise', '乌龟')}</Option>
                <Option value="hare"> {t('Hare', '野兔')}</Option>
                <Option value="cheetah"> {t('Cheetah', '猎豹')}</Option>
                <Option value="falcon"> {t('Falcon', '游隼')}</Option>
                <Option value="blue-hedgehog"> {t('Blue Hedgehog', '蓝刺猬')}</Option>
              </Select>
            </div>
            <div className="sider-item">
              <Dropdown overlay={this.examplesMenu} trigger={['click']}>
                <Button>
                  {t('Load Example', '读取示例')}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <div className="sider-item">
              <Button icon={<SaveOutlined />} onClick={this.onSave}>
                {t('Save', '保存')}
              </Button>
              <Upload accept=".webp" showUploadList={false} beforeUpload={this.onLoad}>
                <Button icon={<UploadOutlined />}>{t('Load', '加载')}</Button>
              </Upload>
            </div>
            <div className="sider-spacer" />
            <div className="sider-last" />
          </div>
        </Sider>
      </Layout>
    );
  }
}
