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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNames = exports.getNamespaces = exports.getClasses = exports.getInterfaces = exports.getStructs = exports.getAttributes = exports.getKeywords = exports.getSnippets = void 0;
const monaco = __importStar(require("monaco-editor"));
function getSnippets(range) {
    return [
        {
            label: 'class',
            insertText: `class \${1:Name} 
{
    $0
}`
        },
        {
            label: 'interface',
            insertText: `interface I\${1:Name} 
{
    $0
}`
        },
        {
            label: 'enum',
            insertText: `enum \${1:Name} 
{
    $0
}`
        },
        {
            label: 'namespace',
            insertText: `namespace \${1:Name} 
{
    $0
}`
        },
        {
            label: 'prop',
            insertText: 'public ${1:int} ${2:MyProperty} { get; set; }'
        },
        {
            label: 'propfull',
            insertText: `private \${1:int} \${2:myVar};
public int \${3:MyProperty}
{
    get { return \$2; }
    set { \$2 = value; }
}`
        },
        {
            label: 'sample',
            insertText: `using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace MyProject.DTOs
{
    public class Item : BaseItem
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public System.String MoreText { get; private set; }
        public bool IsWhatever { get; set; }
        public IEnumerable<string> Collection { get; set; }
        public double[] Array { get; set; }
        public string[,] Array2D { get; set; }
        public string[][] ArrayOfArrays { get; set; }
        public (int, string) Tuple { get; set; }
        public int? Nullable { get; set; }
        public List<double?> MaybeNumbers { get; set; }
        public GenericItem<string> Generic { get; set; }
        public Dictionary<string, string> Dictionary { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Time { get; set; }
        public string Hello => "Hello World!";
        public byte[] File { get; set; }
        public SomeEnum SomeEnum { get; set; }
        public ISomeInterface SomeInterface { get; set; }

        [JsonIgnore]
        public string IgnoreMe { get; set; }

        [JsonProperty("new_name")]
        public string RenameMe { get; set; }

        [Newtonsoft.Json.JsonProperty(PropertyName = "someOtherName")]
        public string RenameMeToo { get; set; }

        [JsonProperty(propertyName: "(╯°□°）╯︵ ┻━┻)")]
        public string InvalidIdentifier { get; set; }

        private int _backingField;

        public int BackedProperty
        {
            get { return _backingField; }
            set { _backingField = value; }
        }

        public int fieldNotProperty;
        public int first, second;
    }

    public class GenericItem<T>
    {
        public T Stuff { get; set; }
    }

    public class BaseItem
    {
        public ImportMe Imported { get; set; }
    }

    public interface ISomeInterface
    {
        int SomeProperty { get; set; }
    }

    public enum SomeEnum
    {
        Value,
        OtherValue
    }
}`
        }
    ].map(s => {
        return Object.assign(Object.assign({}, s), { kind: monaco.languages.CompletionItemKind.Snippet, insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range });
    });
}
exports.getSnippets = getSnippets;
function getKeywords(range) {
    return [
        'class',
        'interface',
        'enum',
        'namespace',
        'using',
        'public',
        'private',
        'protected',
        'static',
        'const',
        'get',
        'set',
        'char',
        'ulong',
        'byte',
        'decimal',
        'double',
        'int',
        'sbyte',
        'float',
        'long',
        'object',
        'bool',
        'short',
        'string',
        'uint',
        'ushort'
    ].map(v => toCompletion(v, monaco.languages.CompletionItemKind.Keyword, range));
}
exports.getKeywords = getKeywords;
function getAttributes(range) {
    return [
        'JsonProperty',
        'JsonPropertyName',
        'JsonIgnore'
    ].map(v => toCompletion(v, monaco.languages.CompletionItemKind.Class, range));
}
exports.getAttributes = getAttributes;
function getStructs(range) {
    return [
        'DateTime',
        'DateTimeOffset',
        'TimeSpan',
        'Guid',
        'Boolean',
        'Char',
        'Byte',
        'SByte',
        'Decimal',
        'Double',
        'Single',
        'Int32',
        'UInt32',
        'Int64',
        'UInt64',
        'Int16',
        'UInt16'
    ].map(v => toCompletion(v, monaco.languages.CompletionItemKind.Struct, range));
}
exports.getStructs = getStructs;
function getInterfaces(range) {
    return [
        'IEnumerable',
        'IDictionary'
    ].map(v => toCompletion(v, monaco.languages.CompletionItemKind.Interface, range));
}
exports.getInterfaces = getInterfaces;
function getClasses(range) {
    return [
        'List',
        'Dictionary',
        'Tuple',
        'String'
    ].map(v => toCompletion(v, monaco.languages.CompletionItemKind.Class, range));
}
exports.getClasses = getClasses;
function getNamespaces(range) {
    return [
        'System',
        'Collections',
        'Generic',
        'Newtonsoft',
        'Text',
        'Json',
        'Serialization'
    ].map(v => toCompletion(v, monaco.languages.CompletionItemKind.Module, range));
}
exports.getNamespaces = getNamespaces;
function getNames(range) {
    return [
        'name',
        'propertyName',
        'PropertyName'
    ].map(v => toCompletion(v, monaco.languages.CompletionItemKind.Variable, range));
}
exports.getNames = getNames;
function toCompletion(value, kind, range) {
    return {
        label: value,
        insertText: value,
        kind: kind,
        range: range
    };
}
