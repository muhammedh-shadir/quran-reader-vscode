import * as vscode from 'vscode';
import { QuranPanelProvider } from './quranPanelProvider';

export function activate(context: vscode.ExtensionContext) {
  const provider = new QuranPanelProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('quranReaderPanel', provider, {
      webviewOptions: { retainContextWhenHidden: true }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('quranReader.openPanel', () => {
      vscode.commands.executeCommand('workbench.view.extension.quranReader');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('quranReader.configure', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'quranReader');
    })
  );
}

export function deactivate() {}
