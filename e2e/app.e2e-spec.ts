import { LlgunPage } from './app.po';

describe('llgun App', () => {
  let page: LlgunPage;

  beforeEach(() => {
    page = new LlgunPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
