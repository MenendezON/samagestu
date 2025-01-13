<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Personnel extends Model
{
    use HasFactory;

    protected $fillable = ['full_name','avatar','phone','date_join','email', 'school_id'];

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = str_replace('-', '', (string) Str::uuid());
            }
        });
    }

    public function Classrooms()
    {
        return $this->hasMany(Classroom::class);
    }

    public function School()
    {
        return $this->belongsTo(School::class);
    }
}