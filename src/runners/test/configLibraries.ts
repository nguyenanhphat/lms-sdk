import React from 'react';
import testUtils from 'react-dom/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import upgradeRenderOfEnzyme from './upgradeRenderOfEnzyme';
import { TestRenderType } from '../../const';

function configFactory() {
  Enzyme.configure({ adapter: new Adapter() });

  if (!(Enzyme as any).isOverrided) {
    const keys = [TestRenderType.mount, TestRenderType.shallow];

    for (const key of keys) {
      upgradeRenderOfEnzyme(Enzyme, key);
    }

    (Enzyme as any).isOverrided = true;
  }

  (global as any).React = React;
  (global as any).Enzyme = Enzyme;
  (global as any).testUtils = testUtils;
}

configFactory();
