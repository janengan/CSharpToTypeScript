"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const monaco = __importStar(require("monaco-editor"));
const lodash_1 = require("lodash");
const completions_1 = require("./completions");
const themes_1 = require("./themes");
window['initializeMonaco'] = (inputEditorContainer, outputEditorContainer, navbar, component) => {
    themes_1.themes.forEach(t => monaco.editor.defineTheme(t.name, t.data));
    monaco.editor.setTheme('vs-dark');
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        diagnosticCodesToIgnore: [
            2307
        ]
    });
    monaco.languages.registerCompletionItemProvider('csharp', {
        provideCompletionItems: (model, position, context) => {
            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };
            return {
                suggestions: [
                    ...completions_1.getSnippets(range),
                    ...completions_1.getKeywords(range),
                    ...completions_1.getAttributes(range),
                    ...completions_1.getStructs(range),
                    ...completions_1.getInterfaces(range),
                    ...completions_1.getClasses(range),
                    ...completions_1.getNamespaces(range),
                    ...completions_1.getNames(range)
                ]
            };
        }
    });
    const inputEditor = monaco.editor.create(inputEditorContainer, {
        language: 'csharp',
        minimap: {
            enabled: false
        },
        contextmenu: false
    });
    inputEditor.onDidChangeModelContent(lodash_1.debounce((e) => __awaiter(void 0, void 0, void 0, function* () { return yield component.invokeMethodAsync('OnInputEditorChangeAsync', inputEditor.getValue()); }), 500, {
        leading: true,
        trailing: true
    }));
    window['getInputEditorValue'] = () => inputEditor.getValue();
    window['setInputEditorValue'] = (value) => inputEditor.setValue(value);
    const outputEditor = monaco.editor.create(outputEditorContainer, {
        language: 'typescript',
        minimap: {
            enabled: false
        },
        contextmenu: false
    });
    window['setOutputEditorValue'] = (value) => outputEditor.setValue(value);
    window['copyToClipboard'] = () => {
        outputEditor.setSelection(outputEditor.getModel().getFullModelRange());
        outputEditor.trigger('copyToClipboard', 'editor.action.clipboardCopyAction', null);
    };
    window['setTheme'] = (themeName) => {
        var _a, _b;
        monaco.editor.setTheme(themeName);
        document.body.style.background = (_b = (_a = themes_1.themes.find(t => t.name === themeName)) === null || _a === void 0 ? void 0 : _a.data.colors['editor.background']) !== null && _b !== void 0 ? _b : themes_1.visualStudioDarkBackgroundColor;
    };
    window.addEventListener('resize', () => {
        const dimensions = {
            width: window.innerWidth / 2,
            height: Math.max(window.innerHeight - navbar.offsetHeight, 100)
        };
        inputEditor.layout(dimensions);
        outputEditor.layout(dimensions);
    });
};
