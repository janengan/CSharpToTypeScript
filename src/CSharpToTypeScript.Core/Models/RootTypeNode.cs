using System.Collections.Generic;
using System.Linq;
using CSharpToTypeScript.Core.Models.TypeNodes;
using CSharpToTypeScript.Core.Options;
using CSharpToTypeScript.Core.Utilities;

using static CSharpToTypeScript.Core.Utilities.StringUtilities;

namespace CSharpToTypeScript.Core.Models
{
    internal class RootTypeNode : RootNode
    {
        public RootTypeNode(string name, IEnumerable<FieldNode> fields, IEnumerable<string> genericTypeParameters,
            IEnumerable<TypeNode> baseTypes, bool fromInterface)
        {
            Name = name;
            Fields = fields;
            GenericTypeParameters = genericTypeParameters;
            BaseTypes = baseTypes;
            FromInterface = fromInterface;
        }

        public override string Name { get; }
        public IEnumerable<FieldNode> Fields { get; }
        public IEnumerable<string> GenericTypeParameters { get; }
        public IEnumerable<TypeNode> BaseTypes { get; }
        public bool FromInterface { get; }

        public override IEnumerable<string> Requires
            => Fields.SelectMany(f => f.Requires)
                .Concat(BaseTypes.SelectMany(b => b.Requires))
                .Except(GenericTypeParameters)
                .Distinct();

        public override string WriteTypeScript(CodeConversionOptions options, Context context)
        {
            context = context.Clone();
            context.GenericTypeParameters = GenericTypeParameters;

            var className = Name.TransformIf(options.RemoveInterfacePrefix, StringUtilities.RemoveInterfacePrefix);

            if (options.OutputType == OutputType.Class)
            {
                className = className.Replace("Model", "");
            }

            // keywords
            var classFile = "export ".If(options.Export)
                // type
                + (!FromInterface && options.OutputType == OutputType.Class ? "class" : "interface") + " "
                // name
                + className
                // generic type parameters
                + ("<" + GenericTypeParameters.ToCommaSepratedList() + ">").If(GenericTypeParameters.Any())
                // base types
                + (" extends " + BaseTypes.WriteTypeScript(options, context).ToCommaSepratedList()).If(BaseTypes.Any())
                // body
                + " {" + NewLine
                + (options.OutputType == OutputType.Interface
                // fields
                ? (Fields.WriteTypeScript(options, context).Indent(options.UseTabs, options.TabSize).LineByLine() + NewLine)
                : ("   constructor(" + NewLine
                + Fields.WriteTypeScript(options, context).PrefixText("public ").ReplaceText(";", ",").Indent(true, options.TabSize * 2).LineByLine() + NewLine
                + "    ){}"));

            if(options.OutputType == OutputType.Class)
            {
                options.AddStronglyTyped = false;
                classFile += EmptyLine + $"    static fromJson(dto: {Name.TransformIf(options.RemoveInterfacePrefix, StringUtilities.RemoveInterfacePrefix)}): {className}";
                classFile += " {";
                classFile += NewLine + $"        return new {className}(" ;                
                classFile += NewLine + Fields.WriteTypeScript(options, context).PrefixText("dto.").ReplaceText(";", ",").Indent(true, options.TabSize * 2).LineByLine() + NewLine;
                classFile += NewLine + "       );";
                classFile += NewLine + "    }";
            }

            classFile += NewLine + "}"
                + EmptyLine;

            return classFile;
        }
    }
}